from pathlib import Path
from PIL import Image
import json

root = Path(__file__).resolve().parents[1]
asset_dir = root / "client" / "public" / "atlas-assets"
report_path = root / "audit" / "atlas-optimization.json"
results = []

for source in sorted(asset_dir.glob("*.png")):
    target = source.with_suffix(".webp")
    with Image.open(source) as image:
        image.save(target, "WEBP", quality=82, method=6)
        results.append({
            "source": source.name,
            "target": target.name,
            "width": image.width,
            "height": image.height,
            "sourceBytes": source.stat().st_size,
            "targetBytes": target.stat().st_size,
            "savedPercent": round((1 - target.stat().st_size / source.stat().st_size) * 100, 2),
        })

report = {
    "assetCount": len(results),
    "sourceBytes": sum(item["sourceBytes"] for item in results),
    "targetBytes": sum(item["targetBytes"] for item in results),
    "savedPercent": round((1 - sum(item["targetBytes"] for item in results) / sum(item["sourceBytes"] for item in results)) * 100, 2) if results else 0,
    "assets": results,
}
report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(report, ensure_ascii=False, indent=2))
