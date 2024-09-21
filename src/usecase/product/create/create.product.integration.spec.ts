import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import CreateProductUseCase from "./create.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

const inputA = {
    type: "a",
    name: "Product a",
    price: 10,
};

const inputB = {
    type: "b",
    name: "Product b",
    price: 20,
};


describe("Test create product use case", () => {
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

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUseCase(productRepository);

        const outputA = await useCase.execute(inputA);

        expect(outputA).toEqual({
            id: expect.any(String),
            name: inputA.name,
            price: inputA.price,
        });

        const outputB = await useCase.execute(inputB);
        expect(outputB).toEqual({
            id: expect.any(String),
            name: inputB.name,
            price: inputB.price * 2,
        });
    });

    it("should thrown an error when name is missing", async () => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        inputA.name = "";

        await expect(productCreateUseCase.execute(inputA)).rejects.toThrow(
            "product: Name is required"
        );

        inputB.name = "";

        await expect(productCreateUseCase.execute(inputB)).rejects.toThrow(
            "productB: Name is required"
        );
    });

    it("should thrown an error when price is negative", async () => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        inputA.name = "Product a";
        inputA.price = -1;

        await expect(productCreateUseCase.execute(inputA)).rejects.toThrow(
            "product: Price must be greater than zero"
        );

        inputB.name = "Product b";
        inputB.price = -1;

        await expect(productCreateUseCase.execute(inputB)).rejects.toThrow(
            "productB: Price must be greater than zero"
        );
    });

    it("should thrown an error when type is invalid", async () => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        inputA.type = "c";

        await expect(productCreateUseCase.execute(inputA)).rejects.toThrow(
            "Product type not supported"
        );
    });
});