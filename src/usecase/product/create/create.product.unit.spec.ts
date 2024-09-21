import CreateProductUseCase from "./create.product.usecase";

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

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
}


describe("Unit test create product use case", () => {
    it("should create a product", async () => {
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        const outputA = await productCreateUseCase.execute(inputA);

        expect(outputA).toEqual({
            id: expect.any(String),
            name: inputA.name,
            price: inputA.price,
        });

        const outputB = await productCreateUseCase.execute(inputB);
        expect(outputB).toEqual({
            id: expect.any(String),
            name: inputB.name,
            price: inputB.price * 2,
        });
    });

    it("should thrown an error when name is missing", async () => {
        const productRepository = MockRepository();
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
        const productRepository = MockRepository();
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
        const productRepository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        inputA.name = "Product a";
        inputA.price = 10;
        inputA.type = "c";

        await expect(productCreateUseCase.execute(inputA)).rejects.toThrow(
            "Product type not supported"
        );

        inputB.name = "Product b";
        inputB.price = 20;
        inputB.type = "d";

        await expect(productCreateUseCase.execute(inputB)).rejects.toThrow(
            "Product type not supported"
        );
    });
});
