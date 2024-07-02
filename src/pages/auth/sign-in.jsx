import swall from "@/configs/sweetalert";
import { login, setLoading } from "@/stores/auth/authSlice";
import { Input, Button, Typography, Spinner } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const { isLogin, loading, message, error } = useSelector(
    (state) => state.auth,
  );
  const navigate = useNavigate();

  const [loginPayload, setLoginPayload] = useState({
    username: "",
    password: "",
  });

  const loginUser = () => {
    navigate("/dashboard/home", { replace: true });
  };
  const dispatch = useDispatch();
  const signIn = () => {
    dispatch(login(loginPayload));
  };

  useEffect(() => {
    if (isLogin) {
      swall("success", "Berhasil", message, false, loginUser);
    }
    if (error) {
      swall("error", "Gagal", error, false);
    }
  }, [isLogin, loading, message, error]);

  return (
    <section className="p-4 flex items-center h-screen ">
      {loading && <Spinner className="absolute left-4 top-4" />}
      <div className="w-1/2 mx-auto">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Sign In
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Masukkan username dan password anda.
          </Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Username
            </Typography>
            <Input
              size="lg"
              placeholder="username"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={loginPayload.username}
              onChange={(e) =>
                setLoginPayload({ ...loginPayload, username: e.target.value })
              }
            />
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={loginPayload.password}
              onChange={(e) =>
                setLoginPayload({ ...loginPayload, password: e.target.value })
              }
            />
          </div>
          <Button
            className="mt-6"
            fullWidth
            onClick={() => signIn()}
            disabled={loading}
          >
            Masuk
          </Button>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
