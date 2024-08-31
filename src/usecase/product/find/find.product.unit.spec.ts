import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";

const product = ProductFactory.create("a", "Product 1", 500);


function MockRepository() {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
}

describe("Unit Test find product use case", () => {
    it("should find a product", async () => {

        const productRepository = MockRepository();
        const useCase = new FindProductUseCase(productRepository);

        const input = {
            id: product.id
        };

        const output = {
            id: product.id,
            name: "Product 1",
            price: 500
        };

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
    });

    it("should not find a product", async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error("Product not found");
        });

        const useCase = new FindProductUseCase(productRepository);

        const input = {
            id: "xxxx"
        };

        await expect(() => {
            return useCase.execute(input);
        }).rejects.toThrow("Product not found");
    });
});