"use client";
import React,{ useState} from 'react';
import axios from 'axios';

async function login(id:string, password:string) {
  try{
    const response = await axios.post('https://worldisaster.com/auth/signin',{
    body:{"username":id,"password":password}
  });
    console.log('로그인 성공',response);
  } catch (error) {
    console.log('로그인 실패',error);
  }   
}

export default function SingIn() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const handlueSubmit = async(event: React.FormEvent)=>{
    event.preventDefault();
    await login(id, password);
  }
    
  return (
    <>
      <form onSubmit={handlueSubmit}>
        <input onChange={(e)=>{
          setId(e.target.value)
        }} type="text" placeholder="아이디" />
        <input onChange={(e)=>{
          setPassword(e.target.value)
        }} type="password" placeholder="비밀번호" />
        <button type="submit">로그인</button>
      </form>
    </>
  )
}