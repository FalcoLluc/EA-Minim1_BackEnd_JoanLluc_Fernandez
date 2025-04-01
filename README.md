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