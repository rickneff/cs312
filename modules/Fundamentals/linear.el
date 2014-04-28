(require 'cl)

(defun scalar* (scalar vector)
  (map 'list (lambda (x) (* x scalar)) vector))

(defun vector+ (vector1 vector2)
  (map 'list '+ vector1 vector2))

(defun vector- (vector1 vector2)
  (map 'list '- vector1 vector2))

(defun matrix+ (matrix1 matrix2)
  (map 'list 'vector+ matrix1 matrix2))

(defun matrix- (matrix1 matrix2)
  (map 'list 'vector- matrix1 matrix2))

(defun dot* (vector1 vector2)
  (apply '+ (map 'list '* vector1 vector2)))

(defun transpose (matrix)
  (loop for i from 0 to (- (length (first matrix)) 1)
	collect (mapcar (lambda (x) (nth i x)) matrix)))

(defun matrix* (matrix1 matrix2)
  (loop for row in matrix1
	collect (loop for col in (transpose matrix2)
		      collect (dot* row col))))

(defun square-bracket (vector separator &optional function)
  (insert "[")
  (let* ((len (length vector))
	 (len- (- len 1)))
    (loop for i from 0 to len-
	do (let ((current (nth i vector)))
	     (progn (princ (if function (funcall function current) current))
		    (insert (if (< i len-) separator "")))))
    (insert "]\n")
    t))

(defun rowify (vector)
  (square-bracket vector " "))

(defun colify (vector)
  (square-bracket vector ", "))

(defun rowmajor (matrix)
  (square-bracket matrix ", " 'rowify))

(defun colmajor (matrix)
  (square-bracket matrix " " 'colify))
