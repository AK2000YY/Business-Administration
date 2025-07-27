import { Button } from "./ui/button"

const Pagination = ({pageNumber, previousDisable, nextDisable, onNext, onPrevious}: {
    pageNumber: number,
    previousDisable: boolean,
    nextDisable: boolean,
    onNext: () => void,
    onPrevious: () => void
}) => {
  return (
    <div className="w-screen p-3 flex justify-start items-center">
        <Button
            className="bg-[#165D4E]"
            onClick={onNext}
            disabled={nextDisable}
        >
            التالي
        </Button>
        <h1 className="px-4 text-[#165D4E]">{pageNumber}</h1>
        <Button
            className="bg-[#165D4E]"
            onClick={onPrevious}
            disabled={previousDisable}
        >
            السابق
        </Button>
    </div>
  )
}

export default Pagination