"use client";
import React, { useState } from 'react';
import axios from 'axios';

async function login(id: string, password: string) {
  try {
    const response = await axios.post('https://worldisaster.com/auth/signin/google', {
      body: { "username": id, "password": password }
    });
    console.log('로그인 성공', response);
  } catch (error) {
    console.log('로그인 실패', error);
  }
}

export default function SignIn() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await login(id, password);
  }

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto w-full" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            아이디
          </label>
          <input
            onChange={(e) => setId(e.target.value)}
            type="text"
            placeholder="아이디"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            비밀번호
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="비밀번호"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="btn"
          >
            로그인
          </button>
        </div>
      </form>
    </div>
  );
}
