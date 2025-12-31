import * as THREE from 'three/webgpu';
import { Common } from "../core/common";

export class PolygonMesh {
    private common: Common;
    public mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
    private originalPositions: Float32Array | null = null;
    private positionAttr: THREE.BufferAttribute | null = null;
    
    constructor(common: Common) {
        this.common = common;
        this.mesh = this.createMesh();

        this.common.scene.add(this.mesh);
    }

    private createMesh() {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0,
                1.0,  1.0,  0.0,
            -1.0,  1.0,  0.0,
        ]);
        const indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3
        ]);
        const uv = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ]);
        geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
        const posAttr = new THREE.BufferAttribute(vertices, 3);
        geometry.setAttribute('position', posAttr);
        this.positionAttr = posAttr;
        this.originalPositions = new Float32Array(vertices);
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.computeVertexNormals();

        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    /**
     * 頂点位置を毎フレーム更新する。
     * @param time 秒単位の経過時間（例: performance.now()/1000）
     */
    updatePolygon(time: number) {
        if (!this.positionAttr || !this.originalPositions) return;

        const arr = this.positionAttr.array as Float32Array;
        const orig = this.originalPositions;
        if (arr.length < 12 || orig.length < 12) return; // 4頂点分のチェック

        // トップ左の頂点インデックス (vertex 3)
        const vi = 3 * 3; // x,y,z の開始インデックス (9)

        const speed = 1.5; // 往復速度
        const influence = 1.0; // 1.0で完全に中心まで移動
        // 0..1 の周期的値（sinで往復）
        const t = (Math.sin(time * speed) + 1) / 2;
        const factor = t * influence;

        // 原点 (中心)
        const cx = 0.0;
        const cy = 0.0;

        // 元の位置
        const ox = orig[vi];
        const oy = orig[vi + 1];
        const oz = orig[vi + 2];

        // 中心へ近づけたり元に戻したり（線形補間）
        arr[vi]     = ox * (1 - factor) + cx * factor;
        arr[vi + 1] = oy * (1 - factor) + cy * factor;
        // Zは元のままにする（必要なら同様に変化させてください）
        arr[vi + 2] = oz;

        this.positionAttr.needsUpdate = true;
        this.mesh.geometry.computeVertexNormals();
    }
}