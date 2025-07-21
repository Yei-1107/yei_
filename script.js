document.addEventListener('DOMContentLoaded', () => {
  const materias = document.querySelectorAll('.materia');

  // Restaurar progreso desde localStorage
  materias.forEach(materia => {
    const id = materia.dataset.id;
    if (localStorage.getItem(id) === 'aprobada') {
      materia.classList.add('aprobada');
    }

    // Bloquear si tiene prerequisitos
    const prereq = materia.dataset.prereq;
    if (prereq) {
      materia.classList.add('bloqueada');
    }

    // Click para aprobar o desaprobar
    materia.addEventListener('click', () => {
      if (materia.classList.contains('bloqueada')) return;

      materia.classList.toggle('aprobada');

      if (materia.classList.contains('aprobada')) {
        localStorage.setItem(id, 'aprobada');
      } else {
        localStorage.removeItem(id);
      }

      actualizarBloqueos();
    });
  });

  // Restaurar bloqueos al cargar
  actualizarBloqueos();

  // Crear botón "Destachar todo"
  const btn = document.createElement('button');
  btn.textContent = 'Destachar todo';
  btn.style.margin = '20px auto';
  btn.style.display = 'block';
  btn.style.padding = '10px';
  btn.style.fontSize = '16px';
  btn.style.borderRadius = '10px';
  btn.style.cursor = 'pointer';

  btn.addEventListener('click', () => {
    materias.forEach(materia => {
      materia.classList.remove('aprobada');
      localStorage.removeItem(materia.dataset.id);
    });
    actualizarBloqueos();
  });

  document.body.appendChild(btn);
});

function actualizarBloqueos() {
  document.querySelectorAll('.materia').forEach(materia => {
    const prereqs = materia.dataset.prereq?.split(',') || [];

    const desbloqueada = prereqs.every(id => {
      const prereqMateria = document.querySelector(`.materia[data-id="${id.trim()}"]`);
      return prereqMateria && prereqMateria.classList.contains('aprobada');
    });

    if (desbloqueada) {
      materia.classList.remove('bloqueada');
    } else if (prereqs.length > 0) {
      materia.classList.add('bloqueada');
      materia.classList.remove('aprobada');
      localStorage.removeItem(materia.dataset.id); // limpiar si se bloquea de nuevo
    }
  });
}
