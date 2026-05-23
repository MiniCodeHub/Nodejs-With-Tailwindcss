import { useState } from 'react';

export default function App() {

  const [isEditing, setIsEditing] =
    useState(false);

  const [profile, setProfile] =
    useState({
      name: 'Alex Johnson',
      role: 'Frontend Developer',
      email: 'alex@example.com',
      bio: 'Passionate about building modern UI experiences with React and Tailwind CSS.',
    });

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">

      <div className="
        w-full
        max-w-md
        bg-gray-900
        border
        border-gray-800
        rounded-3xl
        overflow-hidden
        shadow-2xl
      ">

        {/* Cover */}
        <div className="
          h-36
          bg-gradient-to-r
          from-cyan-500
          via-blue-500
          to-violet-600
          relative
        ">

          {/* Avatar */}
          <div className="
            absolute
            left-1/2
            bottom-0
            -translate-x-1/2
            translate-y-1/2
            w-28
            h-28
            rounded-full
            border-4
            border-gray-900
            overflow-hidden
            shadow-xl
          ">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="pt-20 px-6 pb-8 text-center">

          {/* Edit Button */}
          <div className="flex justify-end mb-4">

            <button
              onClick={() =>
                setIsEditing(!isEditing)
              }
              className="
                px-4
                py-2
                rounded-xl
                bg-cyan-500
                hover:bg-cyan-400
                text-black
                font-semibold
                transition
              "
            >
              {isEditing
                ? 'Save'
                : 'Edit'}
            </button>
          </div>

          {/* Name */}
          {isEditing ? (

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="
                w-full
                bg-gray-800
                border
                border-gray-700
                rounded-xl
                px-4
                py-3
                text-white
                text-center
                text-2xl
                font-bold
                outline-none
                focus:border-cyan-500
              "
            />

          ) : (

            <h1 className="
              text-3xl
              font-bold
              text-white
            ">
              {profile.name}
            </h1>
          )}

          {/* Role */}
          {isEditing ? (

            <input
              type="text"
              name="role"
              value={profile.role}
              onChange={handleChange}
              className="
                w-full
                mt-4
                bg-gray-800
                border
                border-gray-700
                rounded-xl
                px-4
                py-3
                text-gray-300
                text-center
                outline-none
                focus:border-cyan-500
              "
            />

          ) : (

            <p className="
              mt-3
              text-cyan-400
              font-medium
            ">
              {profile.role}
            </p>
          )}

          {/* Email */}
          {isEditing ? (

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="
                w-full
                mt-4
                bg-gray-800
                border
                border-gray-700
                rounded-xl
                px-4
                py-3
                text-gray-300
                outline-none
                focus:border-cyan-500
              "
            />

          ) : (

            <p className="
              mt-4
              text-gray-400
            ">
              {profile.email}
            </p>
          )}

          {/* Bio */}
          {isEditing ? (

            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={4}
              className="
                w-full
                mt-4
                bg-gray-800
                border
                border-gray-700
                rounded-xl
                px-4
                py-3
                text-gray-300
                outline-none
                resize-none
                focus:border-cyan-500
              "
            />

          ) : (

            <p className="
              mt-6
              text-gray-300
              leading-7
            ">
              {profile.bio}
            </p>
          )}

          {/* Stats */}
          <div className="
            grid
            grid-cols-3
            gap-4
            mt-8
          ">

            <div className="
              bg-gray-800
              rounded-2xl
              py-4
            ">
              <h3 className="
                text-2xl
                font-bold
                text-white
              ">
                120
              </h3>

              <p className="
                text-gray-400
                text-sm
                mt-1
              ">
                Projects
              </p>
            </div>

            <div className="
              bg-gray-800
              rounded-2xl
              py-4
            ">
              <h3 className="
                text-2xl
                font-bold
                text-white
              ">
                48K
              </h3>

              <p className="
                text-gray-400
                text-sm
                mt-1
              ">
                Followers
              </p>
            </div>

            <div className="
              bg-gray-800
              rounded-2xl
              py-4
            ">
              <h3 className="
                text-2xl
                font-bold
                text-white
              ">
                4.9
              </h3>

              <p className="
                text-gray-400
                text-sm
                mt-1
              ">
                Rating
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}