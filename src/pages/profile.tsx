import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import "@/globals.css";

const Profile = () => {

    const user = { name: 'John Doe', email: 'john.doe@example.com' };

    return (
        <div>
            <Navbar />
            <div>
                
            </div>
            <main className="container mx-auto p-4">
           
                <h1 className="text-4xl font-bold mb-4">Perfil del Usuario</h1>
                <p>Nombre: {user.name}</p>
                <p>Email: {user.email}</p>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
