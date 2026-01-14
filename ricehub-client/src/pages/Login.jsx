import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      // REAL BACKEND CALL
      const res = await api.post('/auth/login', data);
      
      // Update the store with the REAL user data
      login(res.data.user);
      
      navigate('/');
    } catch (error) {
      console.error(error); // See the error in F12 console
      alert(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password", { required: true })} />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Link to="/register" className="text-sm text-blue-500 hover:underline">
            Don't have an account? Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;