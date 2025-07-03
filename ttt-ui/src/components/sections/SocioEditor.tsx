import { SocioDto } from "ttt-shared/dto/socio.dto";

function SocioEditor({ socio }: { socio: SocioDto }) {
    return <div>
        <h2>Edit Socio</h2>
        <form>
            <div>
                <label htmlFor="name">Nombre:</label>
                <input type="text" id="name" name="name" defaultValue={socio.nombre} />
            </div>
            {/* Add more fields as necessary */}
            <button type="submit">Save Changes</button>
        </form>
    </div>;
}

export default SocioEditor;
