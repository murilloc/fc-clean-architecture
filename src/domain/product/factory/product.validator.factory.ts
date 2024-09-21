import ValidatorInterface from "../../@shared/validator/validator.interface";
import ProductYupValidator from "../validator/product.yup.validator";
import ProductInterface from "../entity/product.interface";
import ProductB from "../entity/product-b";
import ProductBYupValidator from "../validator/priduct-b.yup.validator";


export default class ProductValidatorFactory {
    static create(product: ProductInterface): ValidatorInterface<ProductInterface> {
        if (product instanceof ProductB) {
            return new ProductBYupValidator();
        }
        return new ProductYupValidator();
    }
}