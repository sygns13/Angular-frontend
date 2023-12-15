export class FiltroEntradaStock {
    almacenId : number;

    id : number;
    fecha: string;
    hora: string;
    fechaInicio: string;
    fechaFinal: string;
    estado : number;
    facturado : number;
    actualizado : number;
    ordenCompraId : number;
    numeroEntradaStock: string;
    
    idProveedor: number;
    nombreProveedor: string;
    documentoProveedor: string;
    idTipoDocumentoProveedor: number;
    
    idFacturaProveedor: number;
    serieFacturaProveedor: string;
    numeroFacturaProveedor: string;
    idTipoComprobante: number;
    
    idUser: number;
    nameUser: string;
    emailUser: string;
    idTipoUser: number;
    buscarDatosUser: string;

    buscarDatos: string;

    estadoPago: number;
}