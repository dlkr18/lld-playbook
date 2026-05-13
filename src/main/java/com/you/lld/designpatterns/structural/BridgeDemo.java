package com.you.lld.designpatterns.structural;

/**
 * Bridge — decouples an abstraction from its implementation so both can vary independently.
 * Avoids a cartesian explosion of subclasses (Shape x Renderer = N*M classes -> N + M).
 * Use cases: shape vs renderer (vector/raster), notification vs transport (email/sms over sync/async).
 */
public class BridgeDemo {

    /* Implementor */
    interface Renderer {
        void renderCircle(double r);
        void renderSquare(double s);
    }

    static class VectorRenderer implements Renderer {
        public void renderCircle(double r) { System.out.println("vector circle r=" + r); }
        public void renderSquare(double s) { System.out.println("vector square s=" + s); }
    }
    static class RasterRenderer implements Renderer {
        public void renderCircle(double r) { System.out.println("raster circle r=" + r); }
        public void renderSquare(double s) { System.out.println("raster square s=" + s); }
    }

    /* Abstraction holds a reference to Implementor */
    static abstract class Shape {
        protected final Renderer renderer;
        Shape(Renderer r) { this.renderer = r; }
        abstract void draw();
    }
    static class Circle extends Shape {
        private final double radius;
        Circle(Renderer r, double radius) { super(r); this.radius = radius; }
        void draw() { renderer.renderCircle(radius); }
    }
    static class Square extends Shape {
        private final double side;
        Square(Renderer r, double s) { super(r); this.side = s; }
        void draw() { renderer.renderSquare(side); }
    }

    public static void main(String[] args) {
        Renderer vec = new VectorRenderer();
        Renderer ras = new RasterRenderer();
        new Circle(vec, 5).draw();
        new Circle(ras, 5).draw();
        new Square(vec, 3).draw();
    }
}
