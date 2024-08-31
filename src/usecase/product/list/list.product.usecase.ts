import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import {InputListProductDto, OutputListProductDto} from "./list.product.dto";
import Product from "../../../domain/product/entity/product";
import ProductInterface from "../../../domain/product/entity/product.interface";

export default class ListProductUseCase {
    private productRepository: ProductRepositoryInterface;

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository;
    }

    async execute(input: InputListProductDto): Promise<OutputListProductDto> {
        const products = await this.productRepository.findAll();
        return OutputMapper.toOutput(products);
    }
}

// tslint:disable-next-line:max-classes-per-file
class OutputMapper {
    static toOutput(product: ProductInterface[]): OutputListProductDto {
        return {
            Products: product.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price,
            })),
        };
    }
}