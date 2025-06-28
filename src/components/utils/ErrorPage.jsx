import React from 'react'

const ErrorPage = () => {
  return (
    <div className="error-page">
    <div className='flex flex-col items-center justify-center border mx-auto mt-20 mb-20 p-10 rounded-lg shadow-lg custom-box'>
      <h1 className='text-8xl font-bold text-red-500 animate-pulse'>404</h1>
      <h2 className='yuji-mai-regular text-4xl font-bold text-gray-500'>Page Not Found</h2>
      {/* <img src="https://media.giphy.com/media/3o7TKS8N4NlqLwJ4Xa/giphy.gif" alt="404" /> */}
      <p className='yuji-mai-regular text-2xl font-bold text-gray-500'>Sorry, the page you are looking for does not exist.</p>
      <p className='yuji-mai-regular text-xl font-bold text-gray-500'>Please check the URL and try again.</p>
      <p className='yuji-mai-regular text-sm font-bold text-green-500'>Or, you can <a href="/" className='underline text-blue-500 font-serif'>go back to the home page</a>.</p>{/* 
      <p>Thank you for visiting our website.</p>
      <p>© 2024 Your Website. All rights reserved.</p>
      <p>Designed by Your Name</p>
      <p>Contact: yourname@example.com</p>
      <p>Phone: (123) 456-7890</p>
      <p>Address: 123 Main Street, City, State, ZIP</p>
      <p>Follow us on <a href="https://www.facebook.com/">Facebook</a>, <a href="https://www.twitter.com/">Twitter</a>, and <a href="https://www.instagram.com/">Instagram</a>.</p>
      <p>Subscribe to our <a href="https://www.example.com/newsletter">newsletter</a> to stay updated on our latest news and promotions.</p>
      <p>Privacy Policy | Terms of Service</p>
      <p>Website by <a href="https://www.example.com/">Your Website</a></p>
      <p>Powered by <a href="https://www.example.com/">Your Website</a></p>
      <p>Disclaimer: This website is for demonstration purposes only. All information on this website is fictional and not intended to be taken as factual.</p>
      <p>Thank you for visiting our website.</p>
       */}

    </div></div>
  )
}

export default ErrorPage