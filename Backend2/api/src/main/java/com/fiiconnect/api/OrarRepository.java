package com.fiiconnect.api;
import java.util.List;



import org.springframework.data.jpa.repository.JpaRepository;

public interface OrarRepository extends JpaRepository<com.fiiconnect.api.Orar, Integer> {
    List<Orar> findByAnAndGrupa(String an, String grupa); //imi returneaza automat select * from orar where an = and grupa =
    List<Orar> findByProfesor(String profesor); // select * from orar where profesor =
}
<<<<<<< HEAD

=======
package com.fiiconnect.api;
import java.util.List;



import org.springframework.data.jpa.repository.JpaRepository;

public interface OrarRepository extends JpaRepository<com.fiiconnect.api.Orar, Integer> {
    List<Orar> findByAnAndGrupa(String an, String grupa);
    List<Orar> findByProfesor(String profesor);
}

>>>>>>> 73ebafa5 (Add files via upload)
=======
>>>>>>> 9be4bf6b (finalback)
