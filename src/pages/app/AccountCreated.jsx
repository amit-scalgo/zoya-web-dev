export default function AccountCreated() {
  return (
    <div className="container mx-auto rounded-lg bg-white p-10 shadow-lg">
      <h1 className="text-center text-4xl font-bold text-green-600">
        Account Created
      </h1>
      <p className="mt-6 text-center text-lg text-gray-700">
        Your account has been created successfully.
      </p>
      <p className="mt-4 text-center text-gray-600">
        Please check your email for further instructions.
        <br />
        Wait for 24 hours to get account access.
      </p>
      <div className="mt-8 flex justify-center">
        <button className="rounded-full bg-green-500 px-6 py-2 text-white hover:bg-green-600">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
