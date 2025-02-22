import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { PagintaionDto } from 'src/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(ProductsService.name);

    onModuleInit() {
        this.$connect();
        this.logger.log('Database connected');
    }

    create(createProductDto: CreateProductDto) {
        return this.product.create({
            data: createProductDto
        });
    }

    async findAll(pagintaionDto: PagintaionDto) {
        const { page, limit } = pagintaionDto;
        const totalPage = await this.product.count({
            where: { available: true }
        });
        const lastPage = Math.ceil(totalPage / limit);

        return {
            data: await this.product.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: { available: true }
            }),
            meta: {
                page,
                total: totalPage,
                lastPage
            }
        };
    }

    async findOne(id: number) {
        const product = await this.product.findFirst({
            where: { id, available: true }
        });
        if (!product)
            throw new RpcException({
                message: `Product with id #${id} not found`,
                status: HttpStatus.BAD_REQUEST
            });

        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        const { id: __, ...data } = updateProductDto;

        await this.findOne(id);
        return this.product.update({
            where: { id },
            data
        });
    }

    async remove(id: number) {
        await this.findOne(id);

        // Eliminasion suave
        return this.product.update({
            where: { id },
            data: {
                available: false
            }
        });
    }
}
