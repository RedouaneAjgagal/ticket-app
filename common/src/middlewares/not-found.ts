import { NotFoundError } from "../errors"

const notFound = () => {
    throw new NotFoundError();
}

export default notFound;