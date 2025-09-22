import { Button, Input } from '@mantine/core';
import { useState } from 'react';

export function Welcome() {
  const [apiResponseData, setApiResponseData] = useState<any>(null);
  const [apiResponseError, setApiResponseError] = useState<any>(null);

  const [form, setForm] = useState({ email: 'email@example.com', password: 'password' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const apiBtnClick = async () => {
    const response = await api.auth.login({ email: form.email, password: form.password });
    if ('error' in response) {
      setApiResponseData(null);
      setApiResponseError(response.error);
      return;
    } 
    setApiResponseData(response);
    setApiResponseError(null);
  };

  return (
    <main className='flex items-center justify-center pt-16 pb-4'>
      <div className='flex-1 flex flex-col items-center gap-16 min-h-0'>
        <header className='flex flex-col items-center gap-9'>
          <h1 className='text-center text-4xl font-bold'>Welcome to the project template!</h1>
          <pre className='text-center text-sm'>This project is build on Fastify and ReactJS</pre>
          <pre className='text-center text-sm'>
            Check the repo:
            <a
              href='https://github.com/mynameisnextstep/fastify-and-react-project-template'
              className='text-blue-500'
            >
              https://github.com/gadzhievislam/fastify-reactjs-project-template
            </a>
          </pre>
        </header>
        <div className='max-w-[500px] w-full space-y-6 px-4'>
          <h2 className='text-center text-xl font-bold'>Try the API sample</h2>
          <p className='text-center text-sm text-gray-400'>Login API returns its received data back, if there're errors it returns the error object, otherwise the data object of a successfull response</p>
          <Input name='email' placeholder='Email' className={'border-2 border-gray-300 rounded-md p-4'} onChange={handleChange} value={form.email}/>
          <Input name='password' placeholder='Password' className={'border-2 border-gray-300 rounded-md p-4'} onChange={handleChange} value={form.password}/>
          <p className='text-center text-sm'>Send mock data to the API auth/login</p>
          <Button onClick={apiBtnClick} className='w-full cursor-pointer hover:bg-blue-500 bg-blue-500 rounded-md text-white p-4'>Click me (send request)</Button>
          {apiResponseError && <>
            <p className='text-white-500'>Error</p>
            <p className='text-red-500 w-200'>{JSON.stringify(apiResponseError)}</p>
            </>}
          {apiResponseData && <>
            <p className='text-white-500'>Response data (Success)</p>
            <p className='text-green-500 w-200'>Response: {JSON.stringify(apiResponseData)}</p>
            </>}
        </div>
      </div>
    </main>
  );
}
