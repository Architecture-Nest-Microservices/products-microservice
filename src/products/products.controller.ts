import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PagintaionDto } from 'src/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    // @Post()
    @MessagePattern({ cmd: 'create_product' })
    create(@Payload() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    // @Get()
    @MessagePattern({ cmd: 'find_all_products' })
    findAll(@Payload() pagintaionDto: PagintaionDto) {
        return this.productsService.findAll(pagintaionDto);
    }

    // @Get(':id')
    @MessagePattern({ cmd: 'find_one_product' })
    findOne(@Payload('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(+id);
    }

    // @Patch(':id')
    @MessagePattern({ cmd: 'update_product' })
    update(
        // @Param('id', ParseIntPipe) id: number,
        // @Body() updateProductDto: UpdateProductDto
        @Payload() updateProductDto: UpdateProductDto
    ) {
        return this.productsService.update(
            updateProductDto.id,
            updateProductDto
        );
    }

    // @Delete(':id')
    @MessagePattern({ cmd: 'delete_product' })
    remove(@Payload('id', ParseIntPipe) id: number) {
        return this.productsService.remove(id);
    }
}
