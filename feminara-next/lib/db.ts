import { PrismaClient } from '@prisma/client';
import path from 'path';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const resolveSqliteUrl = (url?: string) => {
	if (!url) {
		return `file:${path.join(process.cwd(), 'dev.db')}`;
	}

	if (url.startsWith('file:') && !url.startsWith('file:/')) {
		const relativePath = url.replace('file:', '');
		return `file:${path.resolve(process.cwd(), relativePath)}`;
	}

	return url;
};

const databaseUrl = resolveSqliteUrl(process.env.DATABASE_URL);

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		datasources: {
			db: {
				url: databaseUrl,
			},
		},
	});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
