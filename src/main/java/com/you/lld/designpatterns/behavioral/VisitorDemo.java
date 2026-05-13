package com.you.lld.designpatterns.behavioral;

import java.util.Arrays;
import java.util.List;

/**
 * Visitor — add new operations to an object hierarchy *without* modifying the classes.
 * Each element accepts a visitor and dispatches to the right visit() method (double dispatch).
 * Use cases: AST traversal (type checker, code generator, pretty printer over the same tree),
 * tax / reporting over a mixed shape catalogue.
 */
public class VisitorDemo {

    interface ShapeVisitor<R> {
        R visit(Circle c);
        R visit(Square s);
        R visit(Triangle t);
    }

    interface Shape {
        <R> R accept(ShapeVisitor<R> v);
    }

    static class Circle implements Shape {
        final double radius;
        Circle(double r) { radius = r; }
        public <R> R accept(ShapeVisitor<R> v) { return v.visit(this); }
    }
    static class Square implements Shape {
        final double side;
        Square(double s) { side = s; }
        public <R> R accept(ShapeVisitor<R> v) { return v.visit(this); }
    }
    static class Triangle implements Shape {
        final double base, height;
        Triangle(double b, double h) { base = b; height = h; }
        public <R> R accept(ShapeVisitor<R> v) { return v.visit(this); }
    }

    /* Two unrelated operations live in visitors — shapes don't know about either. */
    static class AreaVisitor implements ShapeVisitor<Double> {
        public Double visit(Circle c)   { return Math.PI * c.radius * c.radius; }
        public Double visit(Square s)   { return s.side * s.side; }
        public Double visit(Triangle t) { return 0.5 * t.base * t.height; }
    }
    static class SvgVisitor implements ShapeVisitor<String> {
        public String visit(Circle c)   { return "<circle r=\"" + c.radius + "\"/>"; }
        public String visit(Square s)   { return "<rect w=\"" + s.side + "\" h=\"" + s.side + "\"/>"; }
        public String visit(Triangle t) { return "<polygon base=\"" + t.base + "\" h=\"" + t.height + "\"/>"; }
    }

    public static void main(String[] args) {
        List<Shape> shapes = Arrays.<Shape>asList(new Circle(3), new Square(4), new Triangle(5, 6));
        AreaVisitor area = new AreaVisitor();
        SvgVisitor svg = new SvgVisitor();
        for (Shape s : shapes) {
            System.out.println(s.accept(svg) + "  area=" + s.accept(area));
        }
    }
}
