import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";
import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";
import ProductB from "../../../domain/product/entity/product-b";

const product1 = ProductFactory.create("a", "Product 1", 20) as Product;
const product2 = ProductFactory.create("b", "Product 2", 30) as ProductB;
const product3 = ProductFactory.create("a", "Product 3", 40) as Product;

describe("Test list product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true},
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should list products", async () => {
        const productRepository = new ProductRepository();
        const useCase = new ListProductUseCase(productRepository);

        await productRepository.create(product1);
        await productRepository.create(product2);
        await productRepository.create(product3);


        const input = {};

        const output = await useCase.execute(input);
        expect(output.Products.length).toBe(3);

        expect(output.Products[0].id).toBe(product1.id);
        expect(output.Products[0].name).toBe(product1.name);
        expect(output.Products[0].price).toBe(product1.price);


        expect(output.Products[1].id).toBe(product2.id);
        expect(output.Products[1].name).toBe(product2.name);
        expect(output.Products[1].price).toBe(product2.price);


        expect(output.Products[2].id).toBe(product3.id);
        expect(output.Products[2].name).toBe(product3.name);
        expect(output.Products[2].price).toBe(product3.price);


    });

    it("should list products with empty array", async () => {
        const productRepository = new ProductRepository();
        const useCase = new ListProductUseCase(productRepository);

        const input = {};

        const output = await useCase.execute(input);
        expect(output.Products.length).toBe(0);
    });
});