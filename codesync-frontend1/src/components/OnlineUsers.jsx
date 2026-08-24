function OnlineUsers({ users }) {

    return (

        <div className="p-4">

            <h2 className="text-white font-semibold mb-4">
                Online Users
            </h2>

            {users.length === 0 ? (

                <p className="text-gray-500 text-sm">
                    No users online
                </p>

            ) : (

                <div className="space-y-3">

                    {users.map((user, index) => (

                        <div
                            key={`${user}-${index}`}
                            className="flex items-center gap-3"
                        >

                            <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />

                            <span className="text-gray-300 text-sm">
                                {user}
                            </span>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default OnlineUsers;