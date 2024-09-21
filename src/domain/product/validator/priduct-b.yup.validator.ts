import ValidatorInterface from "../../@shared/validator/validator.interface";
import ProductB from "../entity/product-b";
import * as yup from "yup";

export default class ProductBYupValidator implements ValidatorInterface<ProductB> {
    validate(entity: ProductB) {
        try {
            yup
                .object()
                .shape({
                    id: yup.string().required("Id is required"),
                    name: yup.string().required("Name is required"),
                    price: yup.number().min(1,"Price must be greater than zero"),
                })
                .validateSync({
                    id: entity.id,
                    name: entity.name,
                    price: entity.price,
                }, {
                    abortEarly: false,
                });
        } catch (errors) {
            const e = errors as yup.ValidationError;
            e.errors.forEach((error) => {
                entity.notification.addError({
                    context: "productB",
                    message: error,
                });
            });
        }
    }
}