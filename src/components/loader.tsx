import HashLoader from "react-spinners/HashLoader" 

const Loader = () => {
  return (
    <div
        className="w-screen h-screen flex justify-center items-center"
    >
        <HashLoader
            color="#988561" 
        />
    </div>
  )
}

export default Loader