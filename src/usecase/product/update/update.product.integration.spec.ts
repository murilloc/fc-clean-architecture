import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

const product = ProductFactory.create(
    "a",
    "Product A",
    100
);

const input = {
    id: product.id,
    name: "Product A Updated",
    price: 200,
};


describe("Integration test for product update use", () => {

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

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const updateProductUseCase = new UpdateProductUseCase(productRepository);
        await productRepository.create(product);

        const result = await updateProductUseCase.execute(input);

        expect(result).toEqual(input);
    });

    it("should not update a product", async () => {
        const productRepository = new ProductRepository();
        const updateProductUseCase = new UpdateProductUseCase(productRepository);

        const anotherProduct = ProductFactory.create("a", "Another Product", 50);
        await productRepository.create(anotherProduct);

        await expect(() => {
            return updateProductUseCase.execute(input);
        }).rejects.toThrow("Product not found");
    });

    it("should thrown an error when name is missing", async () => {
        const productRepository = new ProductRepository();
        const updateProductUseCase = new UpdateProductUseCase(productRepository);

        input.name = "";

        await expect(() => {
            return updateProductUseCase.execute(input);
        }).rejects.toThrow("Name is required");
    });
});