'use client';

import styles from "@/app/login/login.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, fetchMe } from "@/store/slices/authSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isAuth, loading } = useAppSelector(state => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!loading && isAuth) {
      router.replace('/admin');
    }
  }, [isAuth, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(process.env.NEXT_PUBLIC_API_URL);
    

    const res = await dispatch(loginUser({ username, password }));
    if (!loginUser.fulfilled.match(res)) return;

    await dispatch(fetchMe());
  };

  if (loading) return null;

  return (
    <div className={styles.login_wrapper}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}