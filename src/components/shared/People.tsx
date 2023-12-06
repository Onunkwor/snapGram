import { Models } from "appwrite"

type UserProps ={
    user?: Models.Document[]
}
const People = ({user} : UserProps) => {
  return (
    <div>
        {user?.map((item,index) => {
            return <div key={index}>
                <img src={item.imageUrl} alt="user" width={40} height={40} />
                </div>
        })}
    </div>
  )
}

export default People