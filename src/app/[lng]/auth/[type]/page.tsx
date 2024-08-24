'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from '../../../i18n/client';

export default function AuthForm({ params: { lng } }: { params: { lng: string } }) {
  const { t } = useTranslation(lng, 'translation');
  const router = useRouter();
  const params = useParams();
  const isLogin = params.type === 'login';
  const [error, setError] = useState('');

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('auth.nameMin'))
      .max(20, t('auth.nameMax'))
      .when('isLogin', (isLogin, schema) => {
        return isLogin ? schema.notRequired() : schema.required(t('auth.nameRequired'));
      }),
    email: Yup.string()
      .email(t('auth.invalidEmail'))
      .required(t('auth.emailRequired')),
    password: Yup.string()
      .min(6, t('auth.passwordMin'))
      .matches(/[a-zA-Z]/, t('auth.passwordLetter'))
      .matches(/[0-9]/, t('auth.passwordNumber'))
      .required(t('auth.passwordRequired')),
  });

  const initialValues = {
    name: '',
    email: '',
    password: '',
    isLogin,
  };

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setError('');

    try {
      const response = await fetch(`/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      router.push('/');
    } catch (error) {
      setError((error as Error)?.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="hidden md:flex w-1/2 bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white flex-col justify-center items-center p-8">
        <h2 className="text-4xl font-bold mb-4">{isLogin ? t('auth.welcomeBack') : t('auth.helloFriend')}</h2>
        <p className="mb-8">{isLogin ? t('auth.loginPrompt') : t('auth.signupPrompt')}</p>
        <button
          onClick={() => router.push(`/auth/${isLogin ? 'signup' : 'login'}`)}
          className="border-2 border-white py-2 px-4 rounded-full hover:bg-white hover:text-[#FF416C] transition duration-300"
        >
          {isLogin ? t('auth.register') : t('auth.login')}
        </button>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <h2 className="text-4xl font-bold mb-4">{isLogin ? t('auth.login') : t('auth.register')}</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 w-full max-w-sm">
              {!isLogin && <div>
                <label htmlFor="name" className="block mb-1">{t('auth.name')}</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border rounded text-black"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>}
              <div>
                <label htmlFor="email" className="block mb-1">{t('auth.email')}</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded text-black"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label htmlFor="password" className="block mb-1">{t('auth.password')}</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-3 py-2 border rounded text-black"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <button
                type="submit"
                className={`w-full bg-[#FF416C] text-white py-2 rounded-full hover:bg-[#FF4B2B] transition duration-300 flex items-center justify-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? t('auth.loggingIn') : t('auth.signingUp')}
                  </>
                ) : (
                  isLogin ? t('auth.login') : t('auth.register')
                )}
              </button>
            </Form>
          )}
        </Formik>
        <p className="mt-4 text-center">
          {isLogin ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}
          <button onClick={() => router.push(`/auth/${isLogin ? 'signup' : 'login'}`)} className="text-[#FF416C] hover:underline ml-1">
            {isLogin ? t('auth.register') : t('auth.login')}
          </button>
        </p>
      </div>
    </div>
  );
}