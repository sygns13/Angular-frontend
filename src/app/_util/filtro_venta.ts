export class FiltroVenta {
    almacenId : number;
    id : number;
    fecha: string;
    hora: string;
    fechaInicio: string;
    fechaFinal: string;
    estadoVenta : number;
    pagado : number;
    tipoVenta : number;
    numeroVenta: string;
    
    idCliente: number;
    nombreCliente: string;
    documentoCliente: string;
    idTipoDocumentoCliente: number;
    
    idComprobante: number;
    serieComprobante: string;
    numeroComprobante: string;
    idTipoComprobante: number;
    
    idUser: number;
    nameUser: string;
    emailUser: string;
    idTipoUser: number;
    buscarDatosUser: string;

    buscarDatos: string;

    idProducto: number;
}