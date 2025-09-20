import { useState } from "react"
import { assets } from "../assets/assets"
import { IMaskMixin } from 'react-imask';
import { useAppContext } from "../context/AppContext";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";


const InputField = ({ type, placeholder, name, handleChange, address }) => (
    <input
        className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        name={name}
        value={address[name]}
        required
    />
)



const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
    <input
        {...props}
        ref={inputRef}
        className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
    />
))

const MaskedInputField = ({ mask, placeholder, name, handleChange, address }) => (
    <MaskedInput
        mask={mask}
        value={address[name]}
        unmask={true} 
        onAccept={(value) => {
            handleChange({
                target: {
                    name,
                    value 
                }
            })
        }}
       
        onBlur={(e) => {
            e.target.value = address[name];
            handleChange(e);
        }}
        placeholder={placeholder}
        name={name}
        required
        overwrite
        
        blocks={{
            [name]: {
                mask: Number,
                thousandsSeparator: ''
            }
        }}
    />
);



const AddAddress = () => {
    const {user,navigate} = useAppContext()
    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const {data} =  await axiosInstance.post("/address/add",{address})
            if (data.success) {
                toast.success(data.message)
                navigate("/cart")
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value
        }))
    }
    
    return (
        <div className="mt-16 pb-16">
            <p className="text-2xl md:text-3xl text-gray-500">Add Shipping <span className="font-semibold text-primary">Address</span></p>
            <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
                <div className="flex-1 max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-3 mt-6 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField type="text" handleChange={handleChange} address={address} placeholder="First Name" name="firstName" />
                            <InputField type="text" handleChange={handleChange} address={address} placeholder="Last Name" name="lastName" />
                        </div>
                        <InputField handleChange={handleChange} address={address} name="email" type="email" placeholder="Email Address" />
                        <InputField handleChange={handleChange} address={address} name="street" type="text" placeholder="Street" />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField handleChange={handleChange} address={address} name="city" type="text" placeholder="City" />
                            <InputField handleChange={handleChange} address={address} name="state" type="text" placeholder="State" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <MaskedInputField
                                handleChange={handleChange}
                                address={address}
                                name="zipcode"
                                placeholder="Zip Code"
                                mask="00000-000" 
                            />
                            <InputField handleChange={handleChange} address={address} name="country" type="text" placeholder="Country" />
                        </div>
                        <MaskedInputField
                            handleChange={handleChange}
                            address={address}
                            name="phone"
                            placeholder="Phone"
                            mask="(00) 00000-0000"
                        />
                        <button className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase">Save Address</button>
                    </form>
                </div>
                <img className="md:mr-16 mb-16 md:mt-0" alt="Add Address" src={assets.add_address_iamge} />
            </div>
        </div>
    )
}

export default AddAddress