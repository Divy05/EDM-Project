import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {toast} from 'react-toastify'
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import {useProfileMutation} from '../../redux/api/usersApiSlice';


const Profile = () => {
    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const {userInfo} = useSelector((state) => state.auth)

    const [updateProfile, {isLoading: loadingUpdateProfile}] = useProfileMutation()

    useEffect(() => {
        setUserName(userInfo.username)
        setEmail(userInfo.email)
    }, [userInfo.email, userInfo.username]);

    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
        } else {
          try {
            const res = await updateProfile({
              _id: userInfo._id,
              username,
              email,
              password,
            }).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success("Profile updated successfully");
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
        }
      };

  return (
    <div className="container mx-auto p-4 mt-[10rem] max-w-3xl">
  <div className="flex flex-col justify-center items-center md:flex-row md:space-x-">
    <div className="w-full md:w-1/2">
      <h2 className="text-3xl font-bold mb-6 text-center md:text-left">Update Profile</h2>
      <form onSubmit={submitHandler} className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <label className="block text-white mb-2 text-lg">Name</label>
          <input
            type="text"
            placeholder="Enter name"
            className="form-input p-4 rounded-md w-full text-gray-900"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-white mb-2 text-lg">Email Address</label>
          <input
            type="email"
            placeholder="Enter email"
            className="form-input p-4 rounded-md w-full text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-white mb-2 text-lg">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className="form-input p-4 rounded-md w-full text-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-white mb-2 text-lg">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            className="form-input p-4 rounded-md w-full text-gray-900"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors duration-300"
          >
            Update
          </button>

          <Link
            to="/user-orders"
            className="bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors duration-300"
          >
            My Orders
          </Link>
        </div>
        {loadingUpdateProfile && <Loader />}
      </form>
    </div>
  </div>
</div>

  );
};

export default Profile;
