
const Button = ({text ,...props}) => {
  return (
 
      <button type="submit" className="btn-primary w-full  bg-blue-500 text-white py-2  rounded my-1 hover:bg-blue-600" {...props}>{text}</button>
   
  )
}

export default Button
