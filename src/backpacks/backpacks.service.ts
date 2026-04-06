import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';
import { CreateBackpackDto } from './dto/create-backpack.dto';
import { Backpack } from './interfaces/backpack.interface';

// Shape of a record that may have been saved before the imageUrls migration
interface LegacyBackpack extends Omit<Backpack, 'imageUrls'> {
  imageUrls?: string[];
  imageUrl?: string;
}

@Injectable()
export class BackpacksService {
  private readonly rootDir = join(__dirname, '..', '..');
  private readonly dataDir = join(this.rootDir, 'data');
  private readonly dataFile = join(this.dataDir, 'backpacks.json');
  private readonly uploadsDir = join(this.rootDir, 'uploads');

  async findAll(): Promise<Backpack[]> {
    const backpacks = await this.readAll();
    return backpacks.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async create(dto: CreateBackpackDto, imageUrls: string[]): Promise<Backpack> {
    const backpacks = await this.readAll();
    const now = new Date().toISOString();

    const backpack: Backpack = {
      id: randomUUID(),
      name: dto.name.trim(),
      description: dto.description?.trim() ?? '',
      price: dto.price ?? null,
      imageUrls,
      createdAt: now,
      updatedAt: now,
    };

    backpacks.push(backpack);
    await this.writeAll(backpacks);

    return backpack;
  }

  private async readAll(): Promise<Backpack[]> {
    await this.ensureStorage();
    const raw = await fs.readFile(this.dataFile, 'utf-8');

    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];

      // Migrate legacy records that have imageUrl instead of imageUrls
      return (parsed as LegacyBackpack[]).map((item) => ({
        ...item,
        imageUrls: item.imageUrls ?? (item.imageUrl ? [item.imageUrl] : []),
      }));
    } catch {
      return [];
    }
  }

  private async writeAll(backpacks: Backpack[]): Promise<void> {
    await this.ensureStorage();
    await fs.writeFile(this.dataFile, JSON.stringify(backpacks, null, 2));
  }

  private async ensureStorage(): Promise<void> {
    await fs.mkdir(this.dataDir, { recursive: true });
    await fs.mkdir(this.uploadsDir, { recursive: true });

    try {
      await fs.access(this.dataFile);
    } catch {
      await fs.writeFile(this.dataFile, '[]');
    }
  }
}
