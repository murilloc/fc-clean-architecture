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


const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        update: jest.fn()
    };
};

describe("Unit test for product update use case", () => {
    it("should update a product", async () => {
        const productRepository = MockRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);
        const output = await productUpdateUseCase.execute(input);
        expect(output).toEqual(input);
    });

    it("should not update a product", async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error("Product not found");
        });
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);
        await expect(() => {
            return productUpdateUseCase.execute(input);
        }).rejects.toThrow("Product not found");
    });

    it("should thrown an error when name is missing", async () => {
        const productRepository = MockRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);

        input.name = "";

        await expect(productUpdateUseCase.execute(input)).rejects.toThrow(
            "Name is required"
        );
    });
});
