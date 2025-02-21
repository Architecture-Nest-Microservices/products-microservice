import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PagintaionDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    })
  }

  async findAll(pagintaionDto: PagintaionDto) {
    const { page, limit } = pagintaionDto;    
    const totalPage = await this.product.count();    
    const lastPage = Math.ceil(totalPage / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        page,
        total: totalPage,
        lastPage
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
