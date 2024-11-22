import { ErrorResponse } from "@/hooks"

interface IError {
    errors: ErrorResponse[];
};

const Errors = (props: React.PropsWithoutRef<IError>) => {
    return (
        props.errors.length
            ? <div className="px-8 py-6 bg-red-500/30 rounded text-red-700 flex flex-col gap-4">
                <h3 className="font-semibold text-2xl">Ooops...</h3>
                <ul className="px-12 font-medium">
                    {props.errors.map((err, index) => (
                        <li key={index} className="list-disc">{err.message}</li>
                    ))}
                </ul>
            </div>
            : null
    )
}

export default Errors