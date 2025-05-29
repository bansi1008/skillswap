export default function AllConnectionModel({ ActiveTab, user }) {
  return (
    <>
      {ActiveTab && (
        <div>
          <h1>
            {user.map((users) => {
              return (
                <div key={users._id}>
                  <h1>{users.name}</h1>
                </div>
              );
            })}
          </h1>
          <h1>hi</h1> {/* Moved outside <p> */}
        </div>
      )}
    </>
  );
}
