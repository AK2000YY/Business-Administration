import HashLoader from "react-spinners/HashLoader" 

const Loader = () => {
  return (
    <div
        className="w-screen h-screen flex justify-center items-center absolute top-0 left-0"
    >
        <HashLoader
            color="#988561" 
        />
    </div>
  )
}

export default Loader