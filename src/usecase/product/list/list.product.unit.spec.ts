import ProductFactory from "../../../domain/product/factory/product.factory";
import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

const product1 = ProductFactory.create("a", "Product 1", 10);
const product2 = ProductFactory.create("b", "Product 2", 40);

const MockRepository = () => {
    return {
        create: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
    };
};


describe("Unit Test list product use case", () => {
    it("should list products", async () => {
        const repository = MockRepository();
        const useCase = new ListProductUseCase(repository);

        const output = await useCase.execute({});

        expect(output.Products.length).toBe(2);
        expect(output.Products[0].id).toBe(product1.id);
        expect(output.Products[0].name).toBe(product1.name);
        expect(output.Products[0].price).toBe(product1.price);
        expect(output.Products[1].id).toBe(product2.id);
        expect(output.Products[1].name).toBe(product2.name);
        expect(output.Products[1].price).toBe(product2.price);

    });

    it("should list products with empty array", async () => {
        const productRepository = MockRepository();
        const useCase = new ListProductUseCase(productRepository);

        productRepository.findAll.mockReturnValue(Promise.resolve([]));

        const result = await useCase.execute({});
        expect(result).toEqual({Products: []});

    });
});

