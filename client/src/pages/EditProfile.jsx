import { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import axiosInstance from '../api/axios'

const EditProfile = () => {
    const { user, setUser, navigate,isLoadingUser } = useAppContext()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        avatar: '',
        imageFile: null,
    })

    useEffect(() => {
        if (isLoadingUser) return
        if (!user) {
            navigate('/')
        } else {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                avatar: user.avatar || '',
            })
        }
    }, [user, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
    
        try {
            const data = new FormData()
            data.append('name', formData.name)
            data.append('email', formData.email)
            if (formData.imageFile) {
                data.append('image', formData.imageFile)
            }
            console.log(formData.imageFile)
            const response = await axiosInstance.patch(
                `/user/update`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            )
    
            setUser(response.data.user)
            toast.success('Profile updated successfully!')
            navigate('/edit-profile')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile.')
        }
    }
    

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return
    
        const previewURL = URL.createObjectURL(file)
        setFormData(prev => ({
            ...prev,
            avatar: previewURL,
            imageFile: file
        }))
    }
    

    return (
        <div className="max-w-xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md"
                        required
                    />
                </div>



                {formData.avatar ? (
                    <img
                        src={formData.avatar}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-full border"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                        No Image
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="uploadInput"
                />
                <label
                    htmlFor="uploadInput"
                    className="block cursor-pointer btn-secondary"
                >
                    Upload New Image
                </label>

                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dull transition"
                >
                    Save Changes
                </button>
            </form>
        </div>
    )
}

export default EditProfile
