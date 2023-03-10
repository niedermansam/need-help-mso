import NavBar from "../../components/Navbar";

function CreateResourceForm() {

    const INIT_RESOURCE = {
        name: '',
        description: '',
        orgName: '',
        url: '',
        tags: [],
        category: '',
    }

    return <form>

    </form>
}

export default function ResourcePage() {
    return <div>
        <NavBar />
        <h1 className="pt-20 text-4xl">Resources</h1>
    </div>
}