MINIM 1 EA BACKEND:

He implementat un nou model "Change" amb les següents propietats:
-Date
-UserID
-CalendarID
-PreviousState
-NewState
-IsDeleted (s'utilitza internament per fer el delete de manera comoda amb un hook de mongoose)

Estan totes les operacions de CRUD fetes, en la ruta changes, però a més, he implementat que cada vegada que es faci un EditCalendar o AddApointmentsToCalendar. El propi controller de Calendar també guardi el Change i faci un CreateChange Automaticament. Per facilitat he hagut de implementar un getCalendarById per simplificar la logica.

FRONTEND:
Esta el llistat paginat, pero faltaria millorar interfície visual i fer que es pugin eliminar varios changes a la vegada (shauria d'implementar al backend)
- No s'acaben de veure els Changes correctament (tots els detalls), faltaria implementar-ho millor. No m'ha donat temps d'acabar d'adaptar-ho tot per a aquest model. Ara mateix simplekemnt es veuren els canvis i podries fer un delete de varis, pero el backend només tinc implementat un delete individual.
- Tot i que no es vegin be tots els detalls en pantalla principal, si entres i clickes a la fila sí que pots veure els canvis en detalls. No m'ha donat temps a solucionar aquest petit error. Les dades arriben be i es poden cargar fent clic, pero a la vista principal paginada no es carguen bé.
