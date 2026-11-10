import { Request, Response } from 'express';
import { RetoService } from '../service/RetoService';

export const getRetos = async (req: Request, res: Response) => {
  try {
    // Capturamos el query parameter desde la URL (ej: ?empresa=Workana)
    const { empresa } = req.query; 
    
    const retos = await RetoService.obtenerTodos(empresa as string);
    
    return res.status(200).json({
      msg: 'Retos obtenidos correctamente',
      data: retos
    });
  } catch (error) {
    console.error('Error al obtener los retos:', error);
    return res.status(500).json({ msg: 'Error interno al obtener los retos' });
  }
};

export const getRetosByEmpresa = async (req: Request, res: Response) => {
  try {
    const { empresa } = req.params; 
    
    // Le pasamos el nombre de la empresa al servicio para que filtre en Firebase
    const retos = await RetoService.obtenerTodos(empresa as string);    
    return res.status(200).json({
      msg: `Retos de ${empresa} obtenidos correctamente`,
      data: retos
    });
  } catch (error) {
    console.error(`Error al obtener los retos de la empresa:`, error);
    return res.status(500).json({ msg: 'Error interno al obtener los retos' });
  }
};

export const getRetoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Capturamos el ID de la URL
    
    const reto = await RetoService.obtenerPorId(id as string);
    
    // Si el servicio devuelve null, mandamos el error 404
    if (!reto) {
      return res.status(404).json({ msg: 'Reto no encontrado' });
    }
    
    return res.status(200).json({
      msg: 'Reto obtenido correctamente',
      data: reto
    });
  } catch (error) {
    console.error('Error al obtener el detalle del reto:', error);
    return res.status(500).json({ msg: 'Error interno al obtener el reto' });
  }
};